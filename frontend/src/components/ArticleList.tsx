import React, { useState } from 'react';
import { Button, Card, Checkbox } from 'antd';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Colors } from './colors';

enum ArticleCategory {
  POSITIVE,
  NEUTRAL,
  NEGATIVE,
  TWITTER,
}

const categoryColors: { [key in ArticleCategory]: string } = {
  [ArticleCategory.NEGATIVE]: Colors.RED,
  [ArticleCategory.NEUTRAL]: Colors.LIGHT_GREY,
  [ArticleCategory.POSITIVE]: Colors.GREEN,
  [ArticleCategory.TWITTER]: Colors.BLUE,
};

const categoryNames: { [key in ArticleCategory]: string } = {
  [ArticleCategory.NEGATIVE]: 'Negative',
  [ArticleCategory.NEUTRAL]: 'Neutral',
  [ArticleCategory.POSITIVE]: 'Positive',
  [ArticleCategory.TWITTER]: 'Twitter',
};

interface Article {
  title: string;
  author: string;
  preview: string;
  category: ArticleCategory;
  text: string;
}

const articles: Article[] = [
  {
    title: 'Rekord od początku epidemii',
    author: 'Jan Kowalski',
    category: ArticleCategory.POSITIVE,
    preview:
      'Mówi się, że koty chodzą własnymi drogami i nie wymagają tak dużej atencji jak psy. Ale czy to oznacza, ' +
      'że mruczków nie trzeba wychowywać? Nic bardziej mylnego! Koty także potrzebują naszej opieki i miłości. ' +
      'Wystrzegaj się tych błędów, a wychowasz zdrowego i szczęśliwego mruczka.',
    text: 'xdxd',
  },
  {
    title: 'Rekord od początku epidemii',
    author: 'Jan Kowalski',
    category: ArticleCategory.NEGATIVE,
    preview:
      'Mówi się, że koty chodzą własnymi drogami i nie wymagają tak dużej atencji jak psy. Ale czy to oznacza, ' +
      'że mruczków nie trzeba wychowywać? Nic bardziej mylnego! Koty także potrzebują naszej opieki i miłości. ' +
      'Wystrzegaj się tych błędów, a wychowasz zdrowego i szczęśliwego mruczka.',
    text: 'xdxd',
  },
  {
    title: 'Rekord od początku epidemii',
    author: 'Jan Kowalski',
    category: ArticleCategory.TWITTER,
    preview:
      'Mówi się, że koty chodzą własnymi drogami i nie wymagają tak dużej atencji jak psy. Ale czy to oznacza, ' +
      'że mruczków nie trzeba wychowywać? Nic bardziej mylnego! Koty także potrzebują naszej opieki i miłości. ' +
      'Wystrzegaj się tych błędów, a wychowasz zdrowego i szczęśliwego mruczka.',
    text: 'xdxd',
  },
  {
    title: 'Rekord od początku epidemii',
    author: 'Jan Kowalski',
    category: ArticleCategory.NEUTRAL,
    preview:
      'Mówi się, że koty chodzą własnymi drogami i nie wymagają tak dużej atencji jak psy. Ale czy to oznacza, ' +
      'że mruczków nie trzeba wychowywać? Nic bardziej mylnego! Koty także potrzebują naszej opieki i miłości. ' +
      'Wystrzegaj się tych błędów, a wychowasz zdrowego i szczęśliwego mruczka.',
    text: 'xdxd',
  },
  {
    title: 'Rekord od początku epidemii',
    author: 'Jan Kowalski',
    category: ArticleCategory.NEGATIVE,
    preview:
      'Mówi się, że koty chodzą własnymi drogami i nie wymagają tak dużej atencji jak psy. Ale czy to oznacza, ' +
      'że mruczków nie trzeba wychowywać? Nic bardziej mylnego! Koty także potrzebują naszej opieki i miłości. ' +
      'Wystrzegaj się tych błędów, a wychowasz zdrowego i szczęśliwego mruczka.',
    text: 'xdxd',
  },
];

interface ArticleListProps {
  close: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ close }) => {
  const [selectedTypes, setSelectedTypes] = useState<ArticleCategory[]>(
    (Object.keys(ArticleCategory) as unknown) as ArticleCategory[],
  );

  return (
    <Container>
      <div style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 5 }}>
          <h2>Articles <span style={{ fontWeight: 400 }}>(124)</span></h2>
          <Button icon={<CloseOutlined />} onClick={close} />
        </div>
        <Checkbox.Group
          value={selectedTypes}
          onChange={value => setSelectedTypes(value as ArticleCategory[])}
          options={Object.keys(categoryNames).map((category) => ({
            label: (
              <span style={{ color: categoryColors[(category as unknown) as ArticleCategory] }}>
                {categoryNames[(category as unknown) as ArticleCategory]}
              </span>
            ),
            value: category,
          }))}
        />
      </div>
      {articles.map((article) => (
        <Card
          style={{ marginBottom: 15 }}
          title={<TitleContainer>{article.title}</TitleContainer>}
          extra={
            <ExtraContainer>
              <div style={{ color: categoryColors[article.category] }}>
                {categoryNames[article.category]}
              </div>
              <small>{article.author}</small>
            </ExtraContainer>
          }
        >
          <p>{article.preview}</p>
        </Card>
      ))}
    </Container>
  );
};

const ExtraContainer = styled.div`
  max-width: 75px;
`;

const TitleContainer = styled.div`
  white-space: initial;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
`;

export default ArticleList;
