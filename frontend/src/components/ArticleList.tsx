import React, { useState } from 'react';
import { Button, Card, Checkbox } from 'antd';
import styled from 'styled-components';
import { CloseOutlined, LikeOutlined, TwitterOutlined } from '@ant-design/icons';
import { Colors } from './colors';
import isMobile from 'is-mobile';
import { Canton } from './cantons';
import { Moment } from 'moment';
import { useQuery } from 'react-query';
import { getTweets } from '../services/service';
import ArticleView from './ArticleView';

export enum ArticleCategory {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  TWITTER = 'twitter',
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

export interface Article {
  title: string;
  author: string;
  preview: string;
  category: ArticleCategory;
  likes?: number; // for tweets only
  id: string;
  titleMd5sum: string;
}

interface ArticleListProps {
  close: () => void;
  canton: Canton;
  date: Moment;
}

const ArticleList: React.FC<ArticleListProps> = ({ close, canton, date }) => {
  const [selectedTypes, setSelectedTypes] = useState<ArticleCategory[]>(
    (Object.values(ArticleCategory) as unknown) as ArticleCategory[]
  );

  const { data: documents, isLoading } = useQuery(['tweets', { canton, date }], getTweets);

  const filteredDocuments = documents?.filter(({ category }) => selectedTypes.includes(category));
  const [modalOpenIdTitle, setModalOpenIdTitle] = useState<
    { id: string; title: string } | undefined
  >();

  return (
    <Container>
      <ArticleView
        visible={!!modalOpenIdTitle}
        onClose={() => setModalOpenIdTitle(undefined)}
        title={modalOpenIdTitle?.title || ''}
        id={modalOpenIdTitle?.id || ''}
      />
      <div style={{ paddingBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 5 }}>
          <h2>
            Articles <span style={{ fontWeight: 400 }}>({filteredDocuments?.length || 0})</span>
          </h2>
          <Button icon={<CloseOutlined />} onClick={close} size={isMobile() ? 'large' : 'middle'} />
        </div>
        <Checkbox.Group
          value={selectedTypes}
          onChange={(value) => setSelectedTypes(value as ArticleCategory[])}
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
      {!filteredDocuments || isLoading
        ? [...Array(5)].map((_, i) => <StyledCard loading key={`loading${i}`} />)
        : filteredDocuments.map((article) => (
            <StyledCard
              clickable={article.category !== ArticleCategory.TWITTER && !isMobile()}
              onClick={
                article.category !== ArticleCategory.TWITTER && !isMobile()
                  ? () => setModalOpenIdTitle({ id: article.id, title: article.title })
                  : undefined
              }
              title={<TitleContainer>{article.title}</TitleContainer>}
              extra={
                <ExtraContainer>
                  <div style={{ color: categoryColors[article.category] }}>
                    {categoryNames[article.category]}
                  </div>
                  <small>{article.author}</small>
                </ExtraContainer>
              }
              actions={
                article.category === ArticleCategory.TWITTER
                  ? [
                      <span>
                        <span style={{ paddingRight: 5 }}>{article.likes || 0}</span>
                        <LikeOutlined />
                      </span>,
                      <a href={`https://twitter.com/i/web/status/${article.id}`}>
                        <TwitterOutlined />
                      </a>,
                    ]
                  : undefined
              }
            >
              <p>{article.preview}</p>
            </StyledCard>
          ))}
      {!isLoading &&
        filteredDocuments?.length === 0 &&
        'No articles has been found for selected date and canton :('}
    </Container>
  );
};

const StyledCard = styled(Card)<{ clickable?: boolean }>`
  margin-bottom: 15px;

  ${({ clickable }) => (!clickable ? '' : 'cursor: pointer;')}
  &:hover {
    ${({ clickable }) => (!clickable ? '' : 'background-color: #0a0a0a;')}
  }
`;

const ExtraContainer = styled.div`
  width: 90px;
  max-width: 90px;
  margin-left: 10px;
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
