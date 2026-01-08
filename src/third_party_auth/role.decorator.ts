import { SetMetadata } from '@nestjs/common';

// Decorator to set the provider for route handlers
export const Provider = (...provider: string[]) => SetMetadata('provider', provider);

// Decorator to set claims for route handlers
export const Claims = (...claims: string[]) => SetMetadata('claims', claims);
