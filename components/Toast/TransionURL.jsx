const TransitionURL = ({type,transactionHash}) =>{
    return(
      <a href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank">{type} success.View your transition</a>
    )
  }
export default TransitionURL;