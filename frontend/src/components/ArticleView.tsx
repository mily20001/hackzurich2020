import React from 'react';
import { useQuery } from 'react-query';
import { Modal, Spin } from 'antd';

import { getArticle } from '../service';

interface DocumentViewProps {
  id: string;
  title: string;
  onClose: () => void;
  visible: boolean;
}

const ArticleView: React.FC<DocumentViewProps> = ({ id, title, onClose, visible }) => {
  const { data, isLoading } = useQuery(visible && id && ['document', id], getArticle);

  return (
    <Modal
      title={title}
      onCancel={onClose}
      visible={visible}
      footer={null}
      centered
      closable
      width={1200}
    >
      {!data || isLoading ? <Spin size="large" /> : data.text}
    </Modal>
  );
};

export default ArticleView;
