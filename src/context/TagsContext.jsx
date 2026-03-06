import { createContext, useContext, useState } from 'react';

const DEFAULT_TAGS = [
  'urgent',
  'high-priority',
  'medium-priority',
  'low-priority',
  'frontend',
  'backend',
  'database',
  'api',
  'testing',
  'documentation',
  'bug-fix',
  'feature',
  'enhancement',
  'refactoring',
  'important',
  'critical',
];

const getInitialTags = () => {
  try {
    const stored = localStorage.getItem('customTags');
    return stored ? JSON.parse(stored) : DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
};

const getInitialDefaultTag = () => {
  return localStorage.getItem('defaultProjectTag') || '';
};

export const TagsContext = createContext(null);

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState(getInitialTags);
  const [defaultTag, setDefaultTag] = useState(getInitialDefaultTag);

  const persistTags = (newTags) => {
    setTags(newTags);
    localStorage.setItem('customTags', JSON.stringify(newTags));
  };

  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      persistTags([...tags, trimmed]);
    }
  };

  const editTag = (oldTag, newTag) => {
    const trimmed = newTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      persistTags(tags.map((t) => (t === oldTag ? trimmed : t)));
      if (defaultTag === oldTag) {
        setDefaultTag(trimmed);
        localStorage.setItem('defaultProjectTag', trimmed);
      }
    }
  };

  const deleteTag = (tag) => {
    persistTags(tags.filter((t) => t !== tag));
    if (defaultTag === tag) {
      setDefaultTag('');
      localStorage.setItem('defaultProjectTag', '');
    }
  };

  const updateDefaultTag = (tag) => {
    setDefaultTag(tag);
    localStorage.setItem('defaultProjectTag', tag);
  };

  return (
    <TagsContext.Provider value={{ tags, defaultTag, addTag, editTag, deleteTag, updateDefaultTag }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => useContext(TagsContext);

