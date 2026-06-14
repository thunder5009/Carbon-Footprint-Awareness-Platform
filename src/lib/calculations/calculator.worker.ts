import { calculateFootprint, CalculatorInputSchema } from "./calculator";

self.onmessage = (event: MessageEvent) => {
  try {
    // Attempt to parse the incoming data to ensure it's valid
    const data = CalculatorInputSchema.parse(event.data);
    
    // Perform the heavy calculation
    const result = calculateFootprint(data);
    
    // Post back the result
    self.postMessage({ type: "SUCCESS", result });
  } catch (error) {
    // Post back any validation or calculation errors
    self.postMessage({ type: "ERROR", error });
  }
};
