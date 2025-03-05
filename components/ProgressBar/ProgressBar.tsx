export default function ProgressBar({percentage}: {percentage: number}) {
    return (
        <div style={{ width: `100%`, height: `8px`, backgroundColor: "lightgray" }}>
            <div style={{ width: `${percentage}%`, backgroundColor: "#162456", height: "8px"}} />
        </div>
    )
}