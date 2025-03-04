export default function ProgressBar({percentage}: {percentage: number}) {
    return (
        <div style={{ width: `100%`, height: `10px`, backgroundColor: "lightgray" }}>
            <div style={{ width: `${percentage}%`, backgroundColor: "blue", height: "10px"}} />
        </div>
    )
}