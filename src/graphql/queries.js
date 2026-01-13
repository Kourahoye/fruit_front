import { gql } from "@apollo/client";

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;

export const GET_FRUITS = gql`
  query GetFruits {
    fruits {
      id
      name
      nbTags
    }
  }
`;


export const GET_FRUITS_BY_TAGS = gql`
  query GetFruitsByTags($incl: [String!], $excl: [String!]) {
    getFruitByMultipleTag(incl: $incl, excl: $excl) {
      id
      name
      nbTags
    }
  }`


export const GET_ALL_COLORS = gql`
  query GetAllColors {
    colors {
      id
      name
      hexCode
    }
  }`


export const GET_ALL_FRUITS = gql`
  query GetAllFruits {
    fruits {
      id 
      name
      image{
      url
      }
      description
      color {
        id
        name
        hexCode
      }
      tags {
        id
        name
      }
      nbTags
      createdAt
      updatedAt
    }
  }
`;


export const GET_FRUIT = gql`
  query Getfruit($id: Int!) {
    getFruit(id: $id) {
    id
    name
    image {
    url
    }
    description
    color{
    id
    name
    hexCode
    }
    tags{
    id
    name
    }
    nbTags
    createdAt
    updatedAt
    }}
  `;