import { ApiConstants } from "../api/ApiConstants";
import custom_axios from "../axios/AxiosSetup";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
const pageSize = 48;
interface VisitorModel {
  Id: number;
  vFirstName: string;
  vLastName: string;
  vPhoto: string;
}

const VisitorsImage = () => {
  
  const [visitors, setVisitors] = useState<VisitorModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows,setTotalRows]=useState();
  const HandlePageNext=()=>{
    if(visitors.length>0 && currentPage<totalRows){
        setCurrentPage(currentPage+1)
    }
    
}
const HandlePrevious=()=>{
    if(currentPage>1){
        setCurrentPage(currentPage-1)
    }
    
}
  const getVisitorImages = async (pageNumber:number) => {
    const response = await custom_axios.get(ApiConstants.VISITORS.FIND_ALL(pageNumber,pageSize))
    setVisitors(response.data.data);
    setTotalRows(response.data.total);

  }
  useEffect(() => {
    
      getVisitorImages(currentPage);
  }, [currentPage])

  const entriesPerPage = 50;
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedLogs = visitors.slice(startIndex, endIndex);
  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
  <div className="bg-blue-300 overflow-hidden">
    <h1 className="text-xl text-gray-800 md:text-2xl lg:text-3xl text-center p-4 mb-2 font-bold">
      VISITOR IMAGE
    </h1>
  </div>

  <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
    {visitors.map((visitor) => (
      <div key={visitor.Id} className="relative aspect-[16/9] w-full rounded-md md:aspect-auto md:h-[250px] overflow-hidden hover:shadow-lg hover:bg-dark transition-shadow duration-600">
        <img
  className="z-0 h-auto max-w-full mx-auto max-h-full rounded-md object-cover cursor-pointer transition-transform transform hover:scale-105"
  style={{ maxWidth: '90%', maxHeight: '90%' }}
  src={`data:image/jpeg;base64,${visitor.vPhoto}`}
  alt="visitor photo"
/>

        <div className="absolute inset-0 rounded-md bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-center w-full">
          <h1 className="text-lg text-gray-200 md:text-1xl lg:text-0.5xl text-center font-bold">
            {visitor.vFirstName} {visitor.vLastName}
          </h1>
        </div>
      </div>
    ))}
  </div>

  <div className="mt-4 w-full border-gray-300">
        <div className="mt-2 flex items-center justify-between">
          <div className="space-x-2">
            <button
              onClick={HandlePrevious}
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              &larr; Previous
            </button>
            <button
              onClick={HandlePageNext}
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Next &rarr;
            </button>
          </div>
          <p className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
            {currentPage}/{Math.ceil(totalRows / pageSize)}
          </p>
        </div>
      </div>
</div>
  )
}
export default VisitorsImage;