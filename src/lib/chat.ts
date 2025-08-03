import { config } from '../config'

// Define the authentication options
interface AuthOptions {
  type: 'bearer' | 'apikey';
  userSessionId?: string; // For X-Tenant-Id, primarily with API key
}

export async function sendMessage(
  message: string,
  authOptions: AuthOptions = { type: 'bearer' } // Default to bearer token
): Promise<Response> {
  console.log('🌐 API: Starting sendMessage call', { message, authOptions });
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authOptions.type === 'apikey') {
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) {
        console.error('API Key is missing. Please set VITE_API_KEY in your .env file.');
        throw new Error('API Key is not configured for the application.');
      }
      headers['X-API-Key'] = apiKey;
      if (authOptions.userSessionId) {
        headers['X-Tenant-Id'] = authOptions.userSessionId;
      }
    } else { // Default to 'bearer'
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 API: Bearer token found and added to headers');
      } else {
        console.warn('⚠️ API: No bearer token found in localStorage');
      }
      // Note: If X-Tenant-Id is also needed with bearer tokens for some reason,
      // you could add authOptions.userSessionId here too.
      // For now, assuming X-Tenant-Id is primarily for API key user differentiation.
    }

    const requestBody = {
      message,
      session_id: authOptions.userSessionId || null
    };

    console.log('📡 API: Making fetch request to', `${config.apiUrl}/chat/`, {
      method: 'POST',
      headers,
      body: requestBody
    });

    const response = await fetch(`${config.apiUrl}/chat/`, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestBody),
      // Add timeout and signal for better connection handling
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log('📨 API: Response received', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type')
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API: Request failed', { 
        status: response.status, 
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        errorData 
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error(errorData.detail || `Authentication/Authorization error: ${response.status}`);
      }
      if (authOptions.type === 'apikey' && errorData.detail?.includes('API key')) {
         throw new Error('Missing or invalid API key. Please check your configuration.');
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Verify SSE headers
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/event-stream')) {
      console.warn('⚠️ Warning: Expected text/event-stream but got:', contentType);
    }

    console.log('✅ API: Request successful, returning response for streaming');
    return response;
  } catch (error) {
    console.error('❌ API: Error in sendMessage:', error);
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond. Please try again.');
    }
    
    throw error;
  }
}

export async function clearChatHistoryAPI(
  authOptions: AuthOptions = { type: 'bearer' }
): Promise<{ status: string; message: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authOptions.type === 'apikey') {
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) {
        console.error('API Key is missing. Please set VITE_API_KEY in your .env file.');
        throw new Error('API Key is not configured for the application.');
      }
      headers['X-API-Key'] = apiKey;
      // The backend uses current_user.get("tenant_id") which is resolved
      // from X-Tenant-Id when X-API-Key is present.
      if (authOptions.userSessionId) {
        headers['X-Tenant-Id'] = authOptions.userSessionId;
      } else {
        // If API key is used, X-Tenant-Id is usually expected by the backend
        // for the get_current_user middleware to correctly identify the tenant.
        console.warn('X-Tenant-Id is missing for API key authentication during clear history.');
        // Depending on backend strictness, this might be an error or fall back to a default tenant.
      }
    } else { // Default to 'bearer'
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication token not found for clearing history.');
      }
      // If X-Tenant-Id is also needed with bearer tokens for your specific setup,
      // ensure authOptions.userSessionId is passed and set here.
      // The current backend get_current_user likely infers tenant from the bearer token itself.
    }

    const response = await fetch(`${config.apiUrl}/chat/clear_history`, {
      method: 'POST',
      headers,
      // No body is needed for this request as per the backend implementation
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
      if (response.status === 401 || response.status === 403) {
        throw new Error(errorData.detail || `Authentication/Authorization error: ${response.status}`);
      }
      throw new Error(errorData.detail || `Failed to clear chat history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error in clearChatHistoryAPI:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

export async function handleChatStream(
  response: Response,
  onChunk: (content: string, state: Record<string, unknown>) => void,
  onComplete: () => void
): Promise<void> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let isCompleted = false;

  console.log('🔄 Starting SSE stream handling...');
  
  // Verify SSE content type
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/event-stream')) {
    console.warn('⚠️ Warning: Response content-type is not text/event-stream:', contentType);
  }

  try {
    if (!reader) {
      throw new Error('Connection error: Failed to establish stream');
    }

    while (!isCompleted) {
      const { value, done } = await reader.read();
      
      if (done) {
        console.log('📡 Stream ended by server');
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process line by line for SSE format
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

      for (const line of lines) {
        if (line.trim() === '') continue; // Skip empty lines
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6); // Remove 'data: ' prefix
            if (jsonStr.trim() === '') continue; // Skip empty data lines
            
            console.log('📦 Raw SSE data:', jsonStr);
            
            const data = JSON.parse(jsonStr);
            console.log('🔍 Parsed SSE data:', data);

            if (data.error) {
              console.error('❌ Stream error:', data.error);
              throw new Error(data.error);
            }

            // Handle your server's format: {"type": "content", "content": "chunk"}
            if (data.type === 'content' && data.content !== undefined) {
              const timestamp = new Date().toISOString();
              console.log(`📝 Content chunk at ${timestamp}:`, data.content);
              // Call onChunk immediately for each content piece (no delay)
              onChunk(data.content, {});
            } else if (data.type === 'completion') {
              console.log('✅ Stream completion received');
              isCompleted = true;
              break; // Exit the loop when completion is received
            }
          } catch (e) {
            console.error('❌ Error parsing SSE data:', e, 'Line:', line);
            // Continue processing other lines instead of throwing
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    // Don't throw the error, just log it and complete gracefully
    console.warn('⚠️ Stream encountered an error but continuing...');
  } finally {
    console.log('✅ SSE stream handling complete');
    try {
      reader?.releaseLock();
    } catch (e) {
      console.warn('⚠️ Error releasing reader lock:', e);
    }
    onComplete();
  }
}