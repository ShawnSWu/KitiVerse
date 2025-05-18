export async function readCanvasFile(filePath: string): Promise<any> {
  try {
    // Convert relative path to absolute URL
    const url = new URL(filePath, window.location.origin);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading canvas file:', error);
    throw error;
  }
}
