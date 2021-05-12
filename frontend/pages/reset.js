import RequestReset from "../components/RequestReset"
import Reset from "../components/Reset";

export default function ResetPage({query}) {
    if (!query?.token) {
        return (
          <RequestReset></RequestReset>
        )
    }
    return(
        <div>
            <p> Reset Your Password</p>
            <Reset token={query.token}/>
        </div>
        
    )
}