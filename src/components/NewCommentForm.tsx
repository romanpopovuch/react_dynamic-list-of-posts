import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';

interface Props {
  postId: number;
  onAddComment: (comment: Comment) => void;
}

export const NewCommentForm: React.FC<Props> = ({ postId, onAddComment }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    body: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    body: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
    setHasSubmitError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      body: !formData.body.trim(),
    };

    if (newErrors.name || newErrors.email || newErrors.body) {
      setErrors(newErrors);

      return;
    }

    setIsSubmitting(true);
    setHasSubmitError(false);

    const newCommentData = {
      postId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      body: formData.body.trim(),
    };

    client
      .post<Comment>('/comments', newCommentData)
      .then(newComment => {
        onAddComment(newComment);
        setFormData(prev => ({ ...prev, body: '' }));
      })
      .catch(() => {
        setHasSubmitError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleClear = () => {
    setFormData({ name: '', email: '', body: '' });
    setErrors({ name: false, email: false, body: false });
    setHasSubmitError(false);
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={handleSubmit}>
      {hasSubmitError && (
        <div className="notification is-danger" data-cy="AddCommentError">
          Unable to add a comment. Please try again.
        </div>
      )}

      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', { 'is-danger': errors.name })}
            value={formData.name}
            onChange={handleChange}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          {errors.name && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.name && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', { 'is-danger': errors.email })}
            value={formData.email}
            onChange={handleChange}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
          {errors.email && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.email && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': errors.body })}
            value={formData.body}
            onChange={handleChange}
          />
        </div>
        {errors.body && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button', 'is-link', {
              'is-loading': isSubmitting,
            })}
          >
            Add
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

NewCommentForm.propTypes = {
  postId: PropTypes.number.isRequired,
  onAddComment: PropTypes.func.isRequired,
};
