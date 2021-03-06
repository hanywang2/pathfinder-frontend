import { useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import highlightWords from 'highlight-words';

type CourseResult = {
  subject: string;
  catalogNbr: 2110;
  title: string;
  description: string;
  credits: string;
  offered: string;
  requisites: string;
  distribution: string;
  instructors: string;
  grading: string;
  acadGroup: string;
};

const IS_DEV = false;
const BACKEND_ENDPOINT = IS_DEV
  ? 'http://localhost:5000'
  : 'https://cupathfinder-backend.herokuapp.com';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      setIsLoading(true);

      const queryResponse = (await axios.post(
        `${BACKEND_ENDPOINT}/api/search`,
        {
          query: searchInput,
        }
      )) as any;

      if (queryResponse.data.success === true) {
        setCourseResults(queryResponse.data.results);
        setSearchQuery(searchInput);
      } else {
        alert(queryResponse.data.error);
      }

      return setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto">
        <div className="hero">
          <div className="hero-headline flex flex-col items-center justify-center pt-24 text-center">
            <h1 className="logo font-bold text-3xl text-gray-900">
              Pathfinder
            </h1>
            <p className="font-base text-base text-gray-600">
              Find courses at Cornell simply by searching exactly what you want
            </p>
          </div>

          <div className="box pt-6">
            <div className="box-wrapper">
              <div className=" bg-white rounded flex items-center w-full p-3 shadow-sm border border-gray-200">
                <button className="outline-none focus:outline-none">
                  <svg
                    className=" w-5 text-gray-600 h-5 cursor-pointer"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
                <input
                  type="search"
                  name=""
                  id=""
                  placeholder="3 credit programming course taught by Gries that fulfills MRQ requirement"
                  x-model="q"
                  className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="select">
                  <select
                    name=""
                    id=""
                    x-model="image_type"
                    className="text-sm outline-none focus:outline-none bg-transparent"
                  >
                    <option value="all" selected>
                      FA21
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {isLoading === false ? (
            courseResults.map((course) => (
              <CourseCard course={course} searchQuery={searchQuery} />
            ))
          ) : (
            <div className="mt-4">
              <div className="w-full lg:max-w-full lg:flex">
                <div className="w-full border shadow-md bg-white rounded-md p-4 flex flex-col justify-between leading-normal">
                  <div className="mb-8">
                    <div className="text-gray-900 font-bold text-xl mb-2 title cursor-pointer">
                      <Skeleton />
                    </div>
                    <p className="text-gray-700 text-base">
                      <Skeleton />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {searchQuery !== '' &&
            isLoading === false &&
            courseResults.length === 0 && (
              <p className="mt-2 text-gray-700 text-center">No results found</p>
            )}
        </div>

        <footer className="p-5 text-sm text-gray-600 text-center inline-flex items-center">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="heart"
            className="svg-inline--fa fa-heart fa-w-16 text-red-600 w-4 h-4 mr-4 align-middle"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
            ></path>
          </svg>
          <span>
            Made with love.{' '}
            <a
              href="https://twitter.com/HanYeeWang"
              target="_new"
              className="text-teal-600 font-semibold logo"
            >
              Follow Han on Twitter
            </a>{' '}
          </span>
        </footer>
      </div>
    </div>
  );
}

const CourseCard = ({
  course,
  searchQuery,
}: {
  course: CourseResult;
  searchQuery: string;
}) => {
  const underlineQuery = (text: string) => {
    if (text == null || searchQuery == null) return null;
    const chunks = highlightWords({
      text: text,
      query: searchQuery,
    });
    return chunks.map(({ text, match, key }: any) =>
      match ? (
        <span className="font-bold" key={key}>
          {text}
        </span>
      ) : (
        <span key={key}>{text}</span>
      )
    );
  };

  return (
    <div className="mt-4">
      <div className="w-full lg:max-w-full lg:flex">
        <div className="w-full border shadow-md bg-white rounded-md p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <a
              className="text-gray-900 font-medium text-xl mb-2 title cursor-pointer hover:underline"
              href={`https://classes.cornell.edu/browse/roster/FA21/class/${course.subject}/${course.catalogNbr}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {underlineQuery(
                `${course.subject} ${course.catalogNbr}: ${course.title}`
              )}
            </a>
            <p className="text-gray-700 text-base">
              {underlineQuery(course.description)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm leading-tight">
            {course.requisites !== '' && (
              <p className="text-gray-900">
                <span className="font-bold">Co/Prerequisites:</span>{' '}
                {underlineQuery(course.requisites)}
              </p>
            )}
            <p className="text-gray-900">
              <span className="font-bold">Credits:</span>{' '}
              {underlineQuery(course.credits)}
            </p>
            <p className="text-gray-900">
              <span className="font-bold">Offered In:</span>{' '}
              {underlineQuery(course.offered)}
            </p>
            {course.distribution !== '' && (
              <p className="text-gray-900">
                <span className="font-bold">Distribution:</span>{' '}
                {underlineQuery(course.distribution)}
              </p>
            )}
            {course.acadGroup !== '' && (
              <p className="text-gray-900">
                <span className="font-bold">Acad Group:</span>{' '}
                {underlineQuery(course.acadGroup)}
              </p>
            )}
            {course.instructors !== '' && (
              <p className="text-gray-900">
                <span className="font-bold">Instructors:</span>{' '}
                {underlineQuery(course.instructors)}
              </p>
            )}
            <p className="text-gray-900">
              <span className="font-bold">Grading:</span>{' '}
              {underlineQuery(course.grading)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
