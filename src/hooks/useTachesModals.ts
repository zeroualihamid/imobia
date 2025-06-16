
import { useState } from 'react';

export const useTachesModals = () => {
  const [prospectionOpen, setProspectionOpen] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(false);
  const [visitesOpen, setVisitesOpen] = useState(false);
  const [negociationOpen, setNegociationOpen] = useState(false);
  const [actesOpen, setActesOpen] = useState(false);
  const [encaissementOpen, setEncaissementOpen] = useState(false);

  return {
    prospectionOpen,
    setProspectionOpen,
    leadsOpen,
    setLeadsOpen,
    visitesOpen,
    setVisitesOpen,
    negociationOpen,
    setNegociationOpen,
    actesOpen,
    setActesOpen,
    encaissementOpen,
    setEncaissementOpen,
  };
};
