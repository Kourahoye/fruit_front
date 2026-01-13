import { gql } from '@apollo/client';

// --- Mutation refresh ---
export const REFRESH_TOKEN_MUTATION = gql `
  mutation RefreshToken($refreshToken: String!)  {
    refreshToken(refreshToken: $refreshToken) {
      success
      token {
        token
      }
      errors
    }
  }
`;


export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $username: String!, $password1: String!, $password2: String!) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      user {
        id
        username
        email
        verified
      }
    }
  }
`;


export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      success
      errors
      token {
        token
      }
    refreshToken {
        token
      }
      user {
        id
        username
        verified
        isActive
      }
    }
  }
`;

export const ADD_TAG = gql`
  mutation createTag($tagname: String!){
    addTag(name: $tagname){
      id
      name
    }
  }
`

export const REMOVE_TAG = gql `
  mutation removeTag($tagId: Int!){
    deleteTag(id: $tagId){
      success
      message
    }
  }
`

export const UPDATE_TAG = gql `
  mutation updateTag($tagId: Int!, $tagname: String!){
    updateTag(id: $tagId, name: $tagname){
      success
      message
    }
  }
`

export const ADD_COLOR = gql `
  mutation addColor($name:String!, $hex: String!){
      addColor(name:$name,hexval:$hex){
        id
        name
      }
  }
  `

export const DELETE_COLOR = gql`
  mutation deleteColor($id:Int!){
    deleteColor(id:$id){
      success
      message
    }
  }
`

export const UPDATE_COLOR_NAME = gql`
  mutation updateColorName($id:Int!,$name:String!){
    updateColorName(id:$id,name:$name){
      success
      message
    }
  }
`
export const UPDATE_COLOR_HEX = gql`
  mutation updateColorHexCode($id:Int!,$hexvalue:String!){
    updateColorHexcode(id:$id,hexval:$hexvalue){
      success
      message
    }
  }
`
// ...existing code...

export const ADD_FRUIT = gql`
  mutation addFruit($name: String!, $colorId: Int!,$description:String!,$image:Upload!) {
    addFruit(name: $name, colorId: $colorId,description:$description,image:$image) {
      id
      name
    }
  }
`;

export const UPDATE_FRUIT = gql`
  mutation updateFruit($id: Int!, $name: String!,$description:String!) {
    updateFruit(id: $id, name: $name,description:$description) {
      success
      message
    }
  }
`;

export const DELETE_FRUIT = gql`
  mutation deleteFruit($id: Int!) {
    deleteFruit(id: $id) {
      success
      message
    }
  }
`;

export const ADD_TAG_TO_FRUIT = gql`
  mutation addTagToFruit($fruitName: String!, $tagName: String!) {
    addTagToFruit(fruitName: $fruitName, tagName: $tagName) {
      success
      message
    }
  }
`;

export const REMOVE_TAG_FROM_FRUIT = gql`
  mutation removeTag($fruitId: Int!, $tagId: Int!) {
    removeTag(fruitId: $fruitId, tagId: $tagId) {
      success
      message
    }
  }
`;

export const UPDATE_FRUIT_IMAGE = gql`
  mutation updateFruitImage($id: Int!, $image: Upload!) {
    updateFruitImage(id: $id, image: $image) {
      success
      message
    }
  }
`;