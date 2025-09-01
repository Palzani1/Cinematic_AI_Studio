import { FriendlyError } from '../types';

/**
 * Parses an unknown error object into a user-friendly format.
 * @param error The unknown error caught in a try-catch block.
 * @returns A FriendlyError object with a title, technical details, and a remedy.
 */
export const parseApiError = (error: unknown): FriendlyError => {
  const technicalMessage = error instanceof Error ? error.message : String(error);

  // API Key Errors
  if (technicalMessage.toLowerCase().includes('api key not valid')) {
    return {
      title: "Invalid API Key",
      technicalMessage,
      remedy: `It looks like the API key is missing or invalid. Here's how to fix it:
1.  Ensure you have a valid API key from Google AI Studio.
2.  The application is designed to use an environment variable named \`API_KEY\`.
3.  Make sure this environment variable is correctly set in the environment where you are running this application.
4.  You may need to restart the application after setting the environment variable.`
    };
  }
  
  // Quota Errors (Rate Limiting)
  if (technicalMessage.includes('429') || technicalMessage.toLowerCase().includes('resource has been exhausted')) {
    return {
      title: "Request Limit Reached",
      technicalMessage,
      remedy: `You've made too many requests in a short period.
1.  Please wait a few moments before trying again.
2.  If this issue persists, check your usage limits in your Google AI Platform dashboard.`
    };
  }

  // Server-side Errors
  if (technicalMessage.includes('500') || technicalMessage.toLowerCase().includes('internal error')) {
    return {
      title: "Server Error",
      technicalMessage,
      remedy: `There seems to be a temporary issue with the AI service.
1.  This is likely not a problem on your end.
2.  Please wait a few moments and try your request again.`
    };
  }

  // Content/Prompt Blocked
  if (technicalMessage.toLowerCase().includes('prompt was blocked') || technicalMessage.toLowerCase().includes('safety settings')) {
    return {
      title: "Content Safety Issue",
      technicalMessage,
      remedy: `The input prompt or the AI's response was flagged for safety reasons.
1.  Review your input text and remove any potentially sensitive or harmful content.
2.  Try rephrasing your prompt to be more neutral.
3.  If you believe this is a mistake, you can adjust safety settings in your Google AI project (if applicable).`
    };
  }

  // Generic/Unknown Error
  return {
    title: "An Unexpected Error Occurred",
    technicalMessage,
    remedy: `Something went wrong, but we're not sure what.
1.  Try your request again in a few moments.
2.  Check your browser's developer console (F12) for more detailed logs.
3.  Ensure your internet connection is stable.`
  };
};