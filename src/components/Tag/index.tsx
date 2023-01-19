import React, { FC } from 'react';
import { Tag } from '../../ModelTyping/Tag';

export const TagsProduct: FC<Tag> = ({tag, value}) => {
  return (
    <div className="inline-flex bg-text-1 px-2 py-1 rounded text-xs text-white mb-2">
      <span className="opacity-50 mr-1">{tag}:</span><span>{value}</span>
    </div>
  );
};
