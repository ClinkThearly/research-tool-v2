'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ArticleProps = {
  id: number;
  title: string;
  author: string;
  published_date: string;
  relevance_score: number;
  status: 'Relevant' | 'Not Relevant' | 'Ungraded';
  url: string;
};

export function Article({ id, title, author, published_date, relevance_score, status, url }: ArticleProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus: ArticleProps['status']) => {
    try {
      const response = await fetch('/api/update-article-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: id, newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update article status');
      }

      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating article status:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr key={id}>
      <td className="py-2 px-4">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {title}
        </a>
      </td>
      <td className="py-2 px-4">{author}</td>
      <td className="py-2 px-4">{formatDate(published_date)}</td>
      <td className="py-2 px-4">{relevance_score}</td>
      <td className="py-2 px-4">
        <Select onValueChange={handleStatusChange} defaultValue={currentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Relevant">Relevant</SelectItem>
            <SelectItem value="Not Relevant">Not Relevant</SelectItem>
            <SelectItem value="Ungraded">Ungraded</SelectItem>
          </SelectContent>
        </Select>
      </td>
    </tr>
  );
}