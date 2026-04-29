export const isProduction = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export function getEnvironment(): 'prod' | 'dev' {
  if (isProduction()) {
    return 'prod';
  } else {
    return 'dev';
  }
}
