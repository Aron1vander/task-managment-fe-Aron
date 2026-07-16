import { redirect } from "next/navigation";

// Root page for the application.
// This page immediately redirects users from the site root
// to the login screen.
export default function Home() {
  redirect("/login");
}
