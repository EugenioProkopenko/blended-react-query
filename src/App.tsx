import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import './App.css';
import axios from 'axios';
const fetchPerson = async (id: string) => {
  const response = await axios.get(`https://swapi.info/api/people/${id}`);
  return response.data;
};
export default function App() {
  const [count, setCount] = useState('');
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['person', count],
    queryFn: () => fetchPerson(count),
    enabled: count !== '',
  });
  const handleSubmit = (formData: FormData) => {
    const response = formData.get('id') as string;
    setCount(response);
  };
  return (
    <>
      <form action={handleSubmit}>
        <input type="text" name="id" placeholder="Enter character ID" />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p>Louding ...</p>}
      {isError && <p>An error occurred: {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
}
