// src/app/shared/mappings/stage-badge-mapping.ts
import { PaymentStage, Stage } from '../stage.enum'; // Adjust the path according to your project structure

export const stageBadgeClasses: { [key in Stage]: string } = {
  [Stage.Open]: 'badge-primary',
  [Stage.OrderCreated]: 'badge-primary',
  [Stage.Assigned]: 'badge-info',
  [Stage.ModificationRequired]: 'badge-warning',
  [Stage.Modified]: 'badge-info',
  [Stage.Accepted]: 'badge-success',
  [Stage.Rejected]: 'badge-danger',
  [Stage.Closed]: 'badge-success'
};

