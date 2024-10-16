export async function convertStreamToJson<T>(
    stream: ReadableStream<Uint8Array>
  ): Promise<T> {
  
    const reader = stream.getReader();
    const decoder = new TextDecoder(); 
    let result = "";
    let done = false;
  
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
  
      if (value) {
        result += decoder.decode(value, { stream: !done }); 
      }
    }
  
    try {
      const jsonResponse = JSON.parse(result) as T;
  
      return jsonResponse;
    } catch (error) {
      throw new Error("Failed to parse JSON: " + (error as Error).message);
    }
  }