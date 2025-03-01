'use client'

import { useActionState } from 'react';
import {downloadYtVideo} from "@/actions/downloadYtVideo";

export default function VideoDownloadForm({}) {
    const [response, formAction] = useActionState(downloadYtVideo, {});
    return (
        <form action={formAction}>
            <label>Youtube Url video address</label>
            <input name="ytUrlVideo"/>
            <label>Save video name</label>
            <input name="downloadedVideoName"/>
            <button type="submit">Download</button>
        </form>
    )
}