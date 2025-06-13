
import { PropertyMetadata } from '@/types/property';
import { Question } from '@/components/property-agent/questions';

export const processVoiceResponse = (
  response: string,
  question: Question,
  currentData: Partial<PropertyMetadata>
): Partial<PropertyMetadata> => {
  let processedValue: any = response.trim();

  if (question.type === 'number') {
    const numberMatch = response.match(/(\d+)/);
    if (numberMatch) {
      processedValue = parseInt(numberMatch[1]);
    }
  } else if (question.type === 'select' && question.options) {
    const lowerResponse = response.toLowerCase();
    const foundOption = question.options.find(option => 
      lowerResponse.includes(option.toLowerCase()) ||
      option.toLowerCase().includes(lowerResponse)
    );
    if (foundOption) {
      processedValue = foundOption;
    }
  }

  // Update the property data based on the field
  const updatedData: Partial<PropertyMetadata> = { ...currentData };
  
  if (question.field === 'address' || question.field === 'region' || 
      question.field === 'city' || question.field === 'district' || 
      question.field === 'neighborhood') {
    
    const location = typeof updatedData.location === 'object' ? updatedData.location : {};
    updatedData.location = {
      ...location,
      [question.field]: processedValue
    };
  } else if (question.field === 'builtArea' || question.field === 'livingArea' || 
             question.field === 'outdoorArea') {
    
    const surface = typeof updatedData.surface === 'object' ? updatedData.surface : {};
    updatedData.surface = {
      ...surface,
      [question.field]: processedValue
    };
  } else {
    // Safe type assignment using explicit field mapping
    switch (question.field) {
      case 'category':
        updatedData.category = processedValue;
        break;
      case 'propertyType':
        updatedData.propertyType = processedValue;
        break;
      case 'bedrooms':
        updatedData.bedrooms = processedValue;
        break;
      case 'rooms':
        updatedData.rooms = processedValue;
        break;
      case 'bathrooms':
        updatedData.bathrooms = processedValue;
        break;
      case 'price':
        updatedData.price = processedValue;
        break;
      default:
        break;
    }
  }

  return updatedData;
};
