export default function AdPreview({ headlines, descriptions, siteName, displayUrl }) {
  const selectHeadlinesForPreview = (variation) => {
    const pinnedHeadlines = headlines.filter(h => h.pin);
    const unpinnedHeadlines = headlines.filter(h => !h.pin);
    
    const result = ['', '', ''];
    
    // Place pinned headlines
    pinnedHeadlines.forEach(h => {
      result[h.pin - 1] = h.text;
    });
    
    // Fill remaining slots with unpinned
    let unpinnedIndex = variation % Math.max(unpinnedHeadlines.length, 1);
    for (let i = 0; i < result.length; i++) {
      if (!result[i] && unpinnedHeadlines.length > 0) {
        result[i] = unpinnedHeadlines[unpinnedIndex % unpinnedHeadlines.length].text;
        unpinnedIndex++;
      }
    }
    
    return result.filter(h => h);
  };

  const previews = [0, 1, 2].map(i => ({
    headlines: selectHeadlinesForPreview(i),
    descriptions: descriptions.slice(0, 2)
  }));

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-600">Vista Previa (3 variaciones):</p>
      {previews.map((preview, i) => (
        <div key={i} className="border border-gray-300 rounded-md p-3 bg-white text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-600 font-medium uppercase">Sponsored</span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-600">{siteName}</span>
          </div>
          <div className="text-xs text-primary mb-1">{displayUrl}</div>
          <div className="text-blue-700 font-medium text-sm mb-1 hover:underline cursor-pointer">
            {preview.headlines.join(' | ')}
          </div>
          <div className="text-gray-700 text-xs leading-relaxed">
            {preview.descriptions.join(' ')}
          </div>
        </div>
      ))}
    </div>
  );
}
