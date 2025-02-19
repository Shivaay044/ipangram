import Link from "next/link";

export default function EmployeeManagementLanding() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-center items-center p-4">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 text-white w-full rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">Employee Management System</h1>
        <p className="mt-4 text-lg">Easily manage your employees with our user-friendly platform.</p>
        <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link href={"/login"}   className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition">Login</Link>
          <Link href={"/signup"} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition">Sign Up</Link>
        </div>
      </section>
    </div>
  );
}
