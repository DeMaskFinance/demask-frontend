import request from "../utils/httpRequest";
const uploadFileIPFS = async (
  file:any
) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await request.postForm("upload-file-thirdweb", formData);
        return res.data.uri;
      } catch (error) {
        console.error(error);
      }
};
const uploadMetadataIPFS = async (
    body:any
  ) => {
      try {
          const res = await request.post("upload-uri-thirdweb",body);
          return res.data.uri;
        } catch (error) {
          console.error(error);
        }
  };
export {uploadFileIPFS ,uploadMetadataIPFS}