
// AI generation service - requires backend integration
// These functions return placeholder responses when no API key is configured

export const generatePostcardMessage = async (
  topic: string,
  tone: 'funny' | 'romantic' | 'poetic' | 'casual',
  recipient: string,
  location: string
): Promise<string> => {
  // Stub implementation - replace with actual AI integration via backend
  const messages: Record<string, string> = {
    casual: `Having an amazing time exploring ${location || 'this place'}! ${topic} - you'd love it here.`,
    funny: `So ${topic} happened and I immediately thought of you. Only in ${location || 'places like this'}!`,
    romantic: `Every moment here in ${location || 'this beautiful place'} reminds me of you. ${topic} made it even more magical.`,
    poetic: `In the soft light of ${location || 'distant shores'}, ${topic} whispers of moments that linger like warm dreams.`,
  };
  return messages[tone] || messages.casual;
};

export const generateCoverImage = async (
  _prompt: string,
  _aspectRatio: string = "3:4"
): Promise<string | null> => {
  // Stub implementation - AI image generation requires backend integration
  throw new Error("AI image generation requires backend integration. Please connect Enter Cloud.");
};
