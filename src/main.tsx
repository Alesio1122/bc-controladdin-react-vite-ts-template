import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ALHelper from '@floriannoever/bc-controladdin-helper';

/**
 * Creates a React root when the specified HTML element is loaded.
 * @param elementId - The ID of the HTML element where the React root will be created.
 */
export async function mount(elementId: string): Promise<void> {
  const root = await waitForElementToExistId(elementId, 5000);
  createRoot(root as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  root.setAttribute('rvbc-loaded', 'true');

  // Example. Remove for Production
  exampleFunction();
}


// Example. Remove for Production
function exampleFunction(): void {
  // Makes the function available to be called in AL
  ALHelper.makeFunctionAccessible(someGlobalFunction);

  // Calls the AL event OnControlReady with the given data
  const datetime = new Date(Date.now());
  ALHelper.invokeEvent('OnControlReady', 'Control Ready Event. Time: ', datetime.toLocaleTimeString());
}

// Example. Remove for Production
function someGlobalFunction(): void {
  window.alert('Hello, from the Control Add-in!');
}

/**
 * Waits for an HTML element with the specified ID to exist in the DOM.
 * @param elementId - The ID of the HTML element to wait for.
 * @returns A promise that resolves with the HTMLElement when it exists.
 */
function waitForElementToExistId(elementId: string, timeoutMs?: number): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const pollInterval = 50;
    let timeoutId: number | undefined;

    function checkElement(): void {
      const element = document.getElementById(elementId);
      if (!element) {
        setTimeout(checkElement, pollInterval);
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolve(element);
      }
    }

    if (timeoutMs) {
      timeoutId = setTimeout(() => reject(new Error(`Element with id "${elementId}" did not appear within ${timeoutMs}ms`)), timeoutMs);
    }

    checkElement();
  });
}

mount('controlAddIn');
