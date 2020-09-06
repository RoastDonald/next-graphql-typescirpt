import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  posts: PaginatedPosts;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryPostsArgs = {
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Float'];
  authorId: Scalars['Float'];
  text: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
  points: Scalars['Float'];
  author: User;
  title: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  textSnippet: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  email: Scalars['String'];
  username: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  vote: Scalars['Boolean'];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  signUp: UserResponse;
  signIn: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  postId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  body: PostDto;
};


export type MutationUpdatePostArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationChangePasswordArgs = {
  newpassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationSignUpArgs = {
  body: UserDto;
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type PostDto = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserDto = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type DefaultUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & InputErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & UserDataFragment
  )> }
);

export type InputErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'textSnippet' | 'points' | 'voteStatus'>
  & { author: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

export type UserDataFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newpassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type CreatePostMutationVariables = Exact<{
  body: PostDto;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'authorId' | 'text' | 'points' | 'createdAt' | 'updatedAt'>
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'text' | 'points' | 'voteStatus'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type SignInMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type SignUpMutationVariables = Exact<{
  body: UserDto;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp: (
    { __typename?: 'UserResponse' }
    & DefaultUserResponseFragment
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'text' | 'textSnippet'>
  )> }
);

export type VotePostMutationVariables = Exact<{
  postId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type VotePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserDataFragment
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export const InputErrorFragmentDoc = gql`
    fragment inputError on FieldError {
  field
  message
}
    `;
export const UserDataFragmentDoc = gql`
    fragment userData on User {
  id
  username
}
    `;
export const DefaultUserResponseFragmentDoc = gql`
    fragment defaultUserResponse on UserResponse {
  errors {
    ...inputError
  }
  user {
    ...userData
  }
}
    ${InputErrorFragmentDoc}
${UserDataFragmentDoc}`;
export const PostSnippetFragmentDoc = gql`
    fragment postSnippet on Post {
  id
  createdAt
  updatedAt
  title
  textSnippet
  points
  voteStatus
  author {
    id
    username
  }
}
    `;
export const ChangePasswordDocument = gql`
    mutation changePassword($token: String!, $newpassword: String!) {
  changePassword(token: $token, newpassword: $newpassword) {
    ...defaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation createPost($body: PostDto!) {
  createPost(body: $body) {
    id
    authorId
    text
    points
    createdAt
    updatedAt
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation deletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    text
    points
    voteStatus
    author {
      id
      username
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const SignInDocument = gql`
    mutation signIn($usernameOrEmail: String!, $password: String!) {
  signIn(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...defaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useSignInMutation() {
  return Urql.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);
};
export const SignUpDocument = gql`
    mutation signUp($body: UserDto!) {
  signUp(body: $body) {
    ...defaultUserResponse
  }
}
    ${DefaultUserResponseFragmentDoc}`;

export function useSignUpMutation() {
  return Urql.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);
};
export const UpdatePostDocument = gql`
    mutation updatePost($id: Int!, $text: String!, $title: String!) {
  updatePost(id: $id, text: $text, title: $title) {
    id
    title
    text
    textSnippet
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VotePostDocument = gql`
    mutation votePost($postId: Int!, $value: Int!) {
  vote(postId: $postId, value: $value)
}
    `;

export function useVotePostMutation() {
  return Urql.useMutation<VotePostMutation, VotePostMutationVariables>(VotePostDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...userData
  }
}
    ${UserDataFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query posts($limit: Int!, $cursor: String) {
  posts(cursor: $cursor, limit: $limit) {
    hasMore
    posts {
      ...postSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};