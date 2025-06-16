
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  UserCheck, 
  Eye, 
  Handshake, 
  FileText, 
  CreditCard 
} from 'lucide-react';

const TachesConseillers = () => {
  const taches = [
    {
      id: 1,
      titre: "Prospection de biens selon les besoins clients",
      objectif: "Alimenter le portefeuille de biens parfaitement adaptés aux recherches actives",
      icon: Search,
      color: "bg-blue-500",
      sections: [
        {
          titre: "Analyse de la demande",
          items: [
            "Revue quotidienne du pipe : typologie, budget, localisation, délai",
            "Segmentation (résidentiel, bureaux, commerces, locatif/investissement)"
          ]
        },
        {
          titre: "Veille et sourcing",
          items: [
            "Portails immobiliers, annonces PAP, réseaux sociaux, notaires",
            "Réseautage local : gardiens, syndics, promoteurs, confrères",
            "Mailings et campagnes \"Chasse de mandat\" ciblées"
          ]
        },
        {
          titre: "Prise de mandat",
          items: [
            "Pré-estimation rapide, argumentaire valeur, présentation des options : exclusif / simple",
            "Vérification réglementaire (titre de propriété, plans, conformité, certificat de main-levée CNSS)",
            "Signature du mandat + saisie CRM (photos HDR, fiche technique, points forts/faiblesses)"
          ]
        }
      ]
    },
    {
      id: 2,
      titre: "Traitement des leads entrants",
      objectif: "Qualifier, prioriser, transformer un maximum de contacts en rendez-vous",
      icon: UserCheck,
      color: "bg-green-500",
      sections: [
        {
          titre: "Réception et réactivité (SLA < 30 min)",
          items: [
            "Formulaires web, WhatsApp, appels, réseaux sociaux"
          ]
        },
        {
          titre: "Qualification structurée (méthode \"BANT + Situation\")",
          items: [
            "Budget / Autorité / Need (besoin précis) / Timing",
            "Contexte : financement, état d'avancement du projet, expérience immobilière"
          ]
        },
        {
          titre: "Scoring & CRM",
          items: [
            "Attribution de score (chaud, tiède, froid)",
            "Automatisation relance e-mail/SMS pour leads tièdes"
          ]
        },
        {
          titre: "Prise de rendez-vous",
          items: [
            "Créneau visite ou RDV agence, envoi de fiche bien + localisation"
          ]
        }
      ]
    },
    {
      id: 3,
      titre: "Organisation et conduite des visites",
      objectif: "Provoquer le \"coup de cœur\" et recueillir un feedback exploitable",
      icon: Eye,
      color: "bg-purple-500",
      sections: [
        {
          titre: "Pré-visite",
          items: [
            "Check-list état du bien, odeurs, éclairage, disponibilité clés",
            "Brief vendeur pour garantir liberté d'action du conseiller"
          ]
        },
        {
          titre: "Parcours de visite scénarisé",
          items: [
            "Mise en avant des volumes, luminosité, implantation par rapport aux besoins énoncés",
            "Projection : plans 3D, chiffrage home-staging, étude de rentabilité si investisseur"
          ]
        },
        {
          titre: "Recueil feedback immédiat",
          items: [
            "Points positifs/objections à chaud (+ saisie CRM)",
            "Ajustement éventuel de la recherche ou négociation"
          ]
        }
      ]
    },
    {
      id: 4,
      titre: "Négociation & closing",
      objectif: "Aboutir à un accord gagnant-gagnant dans les meilleurs délais",
      icon: Handshake,
      color: "bg-orange-500",
      sections: [
        {
          titre: "Stratégie de prix",
          items: [
            "Étude comparative de marché (CMA) à jour",
            "Argumentaire valeur / potentiel futur"
          ]
        },
        {
          titre: "Gestion des offres",
          items: [
            "Formalisation écrite (offre d'achat ou LOI commerciale)",
            "Prise en compte conditions suspensives (crédit, autorisations d'activité, travaux…)"
          ]
        },
        {
          titre: "Techniques de négociation",
          items: [
            "BATNA, concessions graduées, closing alternatif, urgence maîtrisée",
            "Médiation vendeur-acquéreur pour réduire l'écart"
          ]
        }
      ]
    },
    {
      id: 5,
      titre: "Signature des actes",
      objectif: "Sécuriser juridiquement la transaction",
      icon: FileText,
      color: "bg-indigo-500",
      sections: [
        {
          titre: "Préparation du dossier",
          items: [
            "Réunir diagnostics obligatoires, PV d'AG, règlements de copropriété, quittances taxe foncière, etc."
          ]
        },
        {
          titre: "Compromis / bail / contrat commercial",
          items: [
            "Relecture des clauses sensibles (pénalités, résiliation, indexation de loyer)",
            "Coordination notaire / avocat / banque (édition projet d'acte)"
          ]
        },
        {
          titre: "Accompagnement jusqu'à l'acte authentique",
          items: [
            "Suivi obtention crédit, purge droits de préemption",
            "Convocation et présence le jour J pour lever doutes de dernière minute"
          ]
        }
      ]
    },
    {
      id: 6,
      titre: "Encaissement & suivi post-transaction",
      objectif: "Sécuriser les honoraires et fidéliser le client",
      icon: CreditCard,
      color: "bg-rose-500",
      sections: [
        {
          titre: "Facturation et encaissement",
          items: [
            "Calcul honoraires selon barème, émission facture, suivi règlement",
            "Vérification conformité (retenue à la source, TVA)"
          ]
        },
        {
          titre: "Remise des clés / état des lieux",
          items: [
            "Compte-rendu photos, relevés compteurs, remise carnet d'entretien"
          ]
        },
        {
          titre: "After-sale service",
          items: [
            "Enquête satisfaction, invitation parrainage, alerte anniversaire bail/garantie décennale",
            "Animation communauté clients (newsletter, événements VIP)"
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Tâches détaillées d'un conseiller immobilier en agence
        </h1>
        <p className="text-slate-600">
          Guide complet des responsabilités et processus d'un conseiller immobilier
        </p>
      </div>

      <div className="grid gap-6">
        {taches.map((tache) => {
          const IconComponent = tache.icon;
          return (
            <Card key={tache.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`${tache.color} p-3 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-800 mb-2">
                      {tache.titre}
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      Objectif : {tache.objectif}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {tache.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-3">
                      <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-2">
                        {section.titre}
                      </h4>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TachesConseillers;
