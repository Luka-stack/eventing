import { cookies } from 'next/headers';
import { PostForm } from './PostForm/PostForm';

export default function NewPostPage() {
  const cookieStore = cookies();
  const userid = cookieStore.get('userid');

  if (!userid) {
    return <div>Not logged in</div>;
  }

  return <PostForm userId={userid.value} />;
}
