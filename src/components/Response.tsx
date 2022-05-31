import { ReactNode } from 'react'
import cx from 'classnames'


import '../styles/question.scss'

type ResponseProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
  isResponse?: string;
}


export function Response ({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
  isResponse,
}: ResponseProps) {
  return (
    <div className={cx(
      'response',
      { answered: isAnswered},
      { highlighted: isHighlighted && !isAnswered},
    )}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          
        </div>
      </footer>
      
    </div>
  )
}
