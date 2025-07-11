import { isRouteErrorResponse, Link } from "react-router";
import { Button } from "./ui/button";

export default function CustomErrorBoundary(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return (
      <section className="bg-white dark:bg-gray-900 h-full">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl text-accent-foreground tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              {error.status}
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              {error.data}
            </p>
            <Link to=".." relative="path">
              <Button variant="outline">Go Back</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  } else if (error instanceof Error) {
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              {error.name}
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              {error.message}
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              {error.stack}{" "}
            </p>
            <a
              href="#"
              className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </section>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
