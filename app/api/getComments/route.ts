import { NextResponse, NextRequest } from "next/server";

import { client } from "../../../client";
import { Comment } from "@/typings";
import { groq } from "next-sanity";

// Pobiera wszystkie poprawne komentarze sortujac je od najnowszego

export async function GET(req: NextRequest, res: NextResponse) {
  // wszystkie metody musza byc to searchParams nie zwraca od ani obiektu, ani tablicy przez co nie mozna sie dostac do id
  const tweetId = req.nextUrl.searchParams.entries().next().value[1];
  const commentQuery = groq`*[_type == "comment" && references(*[_type == "tweet" && _id == '${tweetId}']._id)]
  {
    _id,
    ...,
  } | order(_createdAt desc)`;

  try {
    const comments: Comment[] = await client.fetch(commentQuery);
    return NextResponse.json({ comments });
  } catch (error) {
    console.log(error);
    throw new Error("Could not get comments from an api");
  }
}
