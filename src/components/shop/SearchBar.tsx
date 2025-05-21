
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center w-full"
    >
      <Input
        type="text"
        placeholder={t('search.placeholder')}
        className="pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{t('nav.search')}</span>
      </Button>
    </form>
  );
};

export default SearchBar;
