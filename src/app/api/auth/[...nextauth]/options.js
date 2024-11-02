import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../../utils/connect";
import User from "../../../../../models/UserModel";
import bcrypt from "bcrypt";

async function login(credentials) {
  try {
    await connectDB();
    const user = await User.findOne({ email: credentials.email });

    if (!user) throw new Error("Wrong credentials");
    const isCorrect = await bcrypt.compare(credentials.password, user.password);
    if (!isCorrect) throw new Error("Wrong credentials");
    return user;
  } catch (error) {
    console.log("error while logging in the user", error);
    throw new Error("Something went wrong");
  }
}

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          console.log("this is the user: ", user);
          return user;
        } catch (error) {
          console.log("Error: ", error);
          throw new Error("Failed to login");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.fullName;
        token.email = user.email;
        token.id = user.id;
        token.role = user.isAdmin ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
