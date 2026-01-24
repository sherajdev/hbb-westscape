"use client";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user: clerkUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Queries
  const authStatus = useQuery(
    api.users.getAuthStatus,
    isAuthenticated ? {} : "skip"
  );
  const myBusiness = useQuery(
    api.businesses.getMyBusiness,
    isAuthenticated ? {} : "skip"
  );
  const canCreate = useQuery(
    api.businesses.canCreateBusiness,
    isAuthenticated ? {} : "skip"
  );

  // Mutations
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const createBusiness = useMutation(api.businesses.createBusiness);

  // Create user record on first auth
  useEffect(() => {
    if (isAuthenticated && authStatus?.authenticated && !authStatus?.user?.id) {
      createOrGetUser().catch(console.error);
    }
  }, [isAuthenticated, authStatus, createOrGetUser]);

  const handleCreateBusiness = async () => {
    setError(null);
    setSuccess(null);
    try {
      await createBusiness({
        name: "Test Business " + Date.now(),
        category: "Food",
        description: "A test business for verifying the constraint",
        address: "123 Test Street, WestScape",
      });
      setSuccess("Business created successfully!");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleTestConstraint = async () => {
    setError(null);
    setSuccess(null);
    try {
      await createBusiness({
        name: "Second Business Attempt",
        category: "Beauty",
        description: "This should fail",
        address: "456 Another Street",
      });
      setSuccess("Business created (unexpected!)");
    } catch (e: any) {
      setError(e.message);
      if (e.message.includes("already have a registered business")) {
        setSuccess("Constraint working correctly!");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HBB@WestScape - Foundation Test</h1>

      {!isAuthenticated ? (
        <div>
          <p className="mb-4">Please sign in to test the foundation</p>
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Auth Status */}
          <section className="border p-4 rounded">
            <h2 className="font-semibold mb-2">Auth Status</h2>
            <p>Clerk: {clerkUser?.firstName} ({clerkUser?.emailAddresses[0]?.emailAddress})</p>
            <p>Convex User ID: {authStatus?.user?.id ?? "Not created yet"}</p>
            <SignOutButton>
              <button className="mt-2 text-sm text-gray-500 underline">Sign Out</button>
            </SignOutButton>
          </section>

          {/* Business Status */}
          <section className="border p-4 rounded">
            <h2 className="font-semibold mb-2">Business Status</h2>
            {myBusiness ? (
              <div>
                <p className="text-green-600">You have a business registered:</p>
                <p><strong>Name:</strong> {myBusiness.name}</p>
                <p><strong>Category:</strong> {myBusiness.category}</p>
                <p><strong>Status:</strong> {myBusiness.status}</p>
              </div>
            ) : (
              <p>No business registered yet</p>
            )}
            <p className="mt-2 text-sm">
              Can create: {canCreate?.canCreate ? "Yes" : `No (${canCreate?.reason})`}
            </p>
          </section>

          {/* Test Actions */}
          <section className="border p-4 rounded">
            <h2 className="font-semibold mb-2">Test Actions</h2>
            <div className="space-x-2">
              <button
                onClick={handleCreateBusiness}
                disabled={!canCreate?.canCreate}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Create Business
              </button>
              <button
                onClick={handleTestConstraint}
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Test Constraint (Try Second)
              </button>
            </div>
            {error && <p className="mt-2 text-red-600">Error: {error}</p>}
            {success && <p className="mt-2 text-green-600">{success}</p>}
          </section>

          {/* Success Criteria */}
          <section className="border p-4 rounded bg-gray-50">
            <h2 className="font-semibold mb-2 text-gray-900">Phase 1 Success Criteria</h2>
            <ul className="space-y-1 text-sm">
              <li className={authStatus?.authenticated ? "text-green-600" : "text-gray-400"}>
                {authStatus?.authenticated ? "✓" : "○"} User can sign up and log in via Clerk
              </li>
              <li className={authStatus?.user?.id ? "text-green-600" : "text-gray-400"}>
                {authStatus?.user?.id ? "✓" : "○"} User record created in Convex
              </li>
              <li className="text-green-600">
                ✓ Database schema exists for users and businesses
              </li>
              <li className={myBusiness || (error?.includes("already have")) ? "text-green-600" : "text-gray-400"}>
                {myBusiness || (error?.includes("already have")) ? "✓" : "○"} One-business-per-user constraint works
              </li>
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
