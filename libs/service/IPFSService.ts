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
export {uploadFileIPFS ,uploadMetadataIPFS}