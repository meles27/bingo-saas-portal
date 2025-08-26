import { Button } from '@/components/ui/button'; // Assuming a similar shadcn/ui Button component
import { useAuthStore } from '@/store/authStore';
import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
import {
  AlertTriangle,
  ArrowLeft,
  FileSearch,
  FolderSearch,
  Home,
  LogOut, // <-- ADDED: Icon for the logout button
  ServerCrash,
  ShieldOff,
  UserX,
  type LucideProps
} from 'lucide-react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import withAnimation from './route-animation/with-animation';

// --- TYPE DEFINITIONS -

type Size = 'small' | 'large';
type ResourceType = 'item' | 'list';
interface CustomAction {
  label: string;
  handler: () => void;
}

// --- PROPS INTERFACE ---
interface ApiErrorProps {
  error: AxiosBaseQueryErrorResponse | null;
  size?: Size;
  resourceName?: string;
  resourceType?: ResourceType;
  showDetails?: boolean;
  customAction?: CustomAction;
}

// --- THE COMPONENT ---
export const ApiError: React.FC<ApiErrorProps> = withAnimation(
  ({
    error,
    size = 'small',
    resourceName = 'Item',
    resourceType = 'item',
    showDetails = true,
    customAction
  }) => {
    // --- ROUTER & AUTH HOOKS ---
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const goBack = () => navigate(-1);
    const goHome = () => navigate('/');

    // --- MEMOIZED ERROR DETAILS (replaces Vue's computed) ---
    const details = useMemo(() => {
      const status = error?.status;
      const resource = resourceName;

      // A type for the icon component to be returned
      type IconComponent = React.ComponentType<LucideProps>;

      interface ErrorDetails {
        statusCode: number | string;
        title: string;
        description: string;
        icon: IconComponent;
      }

      switch (status) {
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            statusCode: status,
            title: 'Server Error',
            description:
              'Whoops, something went wrong on our servers. Please try again later.',
            icon: ServerCrash
          } as ErrorDetails;
        case 404:
          if (resourceType === 'list') {
            return {
              statusCode: 404,
              title: `No ${resource} Found`,
              description: `We searched high and low, but couldn't find any ${resource.toLowerCase()} matching your request.`,
              icon: FolderSearch
            } as ErrorDetails;
          }
          return {
            statusCode: 404,
            title: `${resource} Not Found`,
            description: `The ${resource.toLowerCase()} you're looking for doesn't exist or has been moved.`,
            icon: FileSearch
          } as ErrorDetails;
        case 403:
          return {
            statusCode: 403,
            title: 'Access Denied',
            description: `You don't have permission to access this ${resource.toLowerCase()}.`,
            icon: ShieldOff
          } as ErrorDetails;
        case 401:
          return {
            statusCode: 401,
            title: 'Unauthorized',
            description: `Your session may have expired. Please log out and sign in again.`,
            icon: UserX
          } as ErrorDetails;
        default:
          return {
            statusCode: status || 'Error',
            title: 'An Unexpected Error Occurred',
            description:
              'Something went wrong. Please try again or contact support if the problem persists.',
            icon: AlertTriangle
          } as ErrorDetails;
      }
    }, [error, resourceName, resourceType]);

    // --- MEMOIZED STYLES (replaces Vue's computed) ---
    const containerClasses = useMemo(
      () => `
    flex items-center justify-center
    ${
      size === 'large'
        ? 'bg-background text-foreground min-h-screen w-full p-4'
        : 'bg-card text-card-foreground p-8 w-full'
    }`,
      [size]
    );

    const iconClasses = useMemo(
      () => `
    text-destructive/70
    ${size === 'large' ? 'w-24 h-24 mb-6' : 'w-16 h-16 mb-4'}`,
      [size]
    );

    const statusCodeClasses = useMemo(
      () => `
    font-bold tracking-wider text-destructive/80
    ${size === 'large' ? 'text-7xl md:text-8xl' : 'text-5xl'}`,
      [size]
    );

    const titleClasses = useMemo(
      () => `
    font-bold tracking-wide
    ${size === 'large' ? 'text-3xl md:text-4xl mt-2' : 'text-2xl mt-2'}`,
      [size]
    );

    const descriptionClasses = useMemo(
      () => `
    text-muted-foreground
    ${size === 'large' ? 'text-lg my-8' : 'text-base my-6'}`,
      [size]
    );

    // --- RENDER LOGIC ---
    // Only render if an error object is provided
    if (!error) {
      return null;
    }

    // Assign the dynamic icon component to a variable
    const Icon = details.icon;

    return (
      <div className={containerClasses.trim()}>
        <div className="flex flex-col items-center text-center">
          {/* Dynamic Icon */}
          <Icon className={iconClasses.trim()} strokeWidth="1.5" />

          {/* Status Code */}
          <p className={statusCodeClasses.trim()}>{details.statusCode}</p>

          {/* Title */}
          <p className={titleClasses.trim()}>{details.title}</p>

          {/* User-friendly Description */}
          <p className={descriptionClasses.trim()}>{details.description}</p>

          {/* Specific API Error Message (Optional and Configurable) */}
          {showDetails && error.data?.detail && (
            <div className="w-full bg-muted/50 border border-border rounded-lg p-3 my-4">
              <p className="text-sm text-muted-foreground font-mono text-left">
                <strong>Details:</strong> {error.data.detail}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            {/* highlight-start */}
            {/* Show Logout button for 401 Unauthorized errors */}
            {error.status === 401 ? (
              <Button onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : customAction ? (
              /* Custom Action Button (if not 401) */
              <Button onClick={customAction.handler}>
                {customAction.label}
              </Button>
            ) : (
              /* Default Home Button (if not 401 and no custom action) */
              <Button onClick={goHome}>
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            )}
            {/* highlight-end */}
          </div>
        </div>
      </div>
    );
  }
);
