import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Meal Planner App</p>
      <>
        <Link href={"/signup"}>Sign Up</Link>
      </>
      <br></br>
      <>
        <Link href={"/login"}>Login</Link>
      </>
    </div>
  );
}
