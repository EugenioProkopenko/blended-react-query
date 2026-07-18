import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import './App.css';
import axios from 'axios';
import Pagination from './Pagination';

export interface Article {
  objectID: string;
  title: string;
  url: string;
}

interface ArticlesHttpResponse {
  hits: Article[];
  nbPages: number;
}

const fetchArticles = async (topic: string, page: number) => {
  const response = await axios.get<ArticlesHttpResponse>(
    'https://hn.algolia.com/api/v1/search',
    {
      params: {
        query: topic,
        page,
      },
    }
  );

  return response.data;
};
export default function App() {
  const [topic, setTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['articles', topic, currentPage],
    queryFn: () => fetchArticles(topic, currentPage),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.nbPages ?? 0;
  const handleSubmit = (formData: FormData) => {
    const response = formData.get('text') as string;
    setTopic(response);
  };
  return (
    <>
      <form action={handleSubmit}>
        <input type="text" name="topic" />
        <button type="submit">Search</button>
      </form>
      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      {isLoading && <p>Louding ...</p>}
      {isError && <p>An error occurred: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
}
