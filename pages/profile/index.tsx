import WithAuth from '@/components/Common/WithAuth';
import Profile from '@/components/Profile/Profile';
import 'tippy.js/dist/tippy.css';

function ProfilePage() {
    return (
        <WithAuth>
            <Profile/>
        </WithAuth>
    )
}

export default ProfilePage;

