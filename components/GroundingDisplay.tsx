import React from 'react';
import { GroundingChunk } from '../types';
import { MapPin, Globe, ExternalLink, Star } from 'lucide-react';

interface GroundingDisplayProps {
  chunks: GroundingChunk[];
}

export const GroundingDisplay: React.FC<GroundingDisplayProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  const webChunks = chunks.filter(c => c.web);
  const mapChunks = chunks.filter(c => c.maps);

  return (
    <div className="mt-4 space-y-4">
      {/* Maps Results */}
      {mapChunks.length > 0 && (
        <div className="bg-sage-50 border border-sage-100 rounded-lg p-4">
          <h4 className="flex items-center text-sm font-semibold text-sage-800 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            Located Nearby
          </h4>
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {mapChunks.map((chunk, idx) => {
              if (!chunk.maps) return null;
              const { title, uri, placeAnswerSources } = chunk.maps;
              // Extract a snippet if available
              const snippet = placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content;

              return (
                <a 
                  key={`map-${idx}`}
                  href={uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white hover:bg-sage-100 transition-colors rounded-md p-3 border border-sage-200 shadow-sm group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sage-900 group-hover:text-sage-700 text-sm">
                      {title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-sage-400 group-hover:text-sage-600 ml-2 flex-shrink-0" />
                  </div>
                  {snippet && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 italic">
                      "{snippet}"
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-sage-600 font-medium">
                    <span className="bg-sage-200 px-1.5 py-0.5 rounded text-sage-800">
                      View on Maps
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Web Search Results */}
      {webChunks.length > 0 && (
        <div className="bg-stone-100 border border-stone-200 rounded-lg p-4">
          <h4 className="flex items-center text-sm font-semibold text-stone-700 mb-2">
            <Globe className="w-4 h-4 mr-2" />
            Sources & References
          </h4>
          <ul className="space-y-2">
            {webChunks.map((chunk, idx) => {
              if (!chunk.web) return null;
              return (
                <li key={`web-${idx}`}>
                  <a 
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start text-xs text-stone-600 hover:text-sage-700 hover:underline transition-colors"
                  >
                    <span className="mr-2 mt-0.5">•</span>
                    <span className="truncate">{chunk.web.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};