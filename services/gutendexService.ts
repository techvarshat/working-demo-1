export interface EbookResult {
  title: string;
  authors: string[];
  pdf?: string;
  epub?: string;
  text?: string;
}

export const searchGutendexBooks = async (query: string): Promise<EbookResult[]> => {
  try {
    const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    return (data.results || []).map((item: any) => {
      const pdf = item.formats["application/pdf"];
      const epub = item.formats["application/epub+zip"];
      const text = item.formats["text/plain; charset=utf-8"];
      if (!pdf && !epub && !text) return null;
      return {
        title: item.title,
        authors: (item.authors || []).map((a: any) => a.name),
        pdf,
        epub,
        text,
      };
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
};
