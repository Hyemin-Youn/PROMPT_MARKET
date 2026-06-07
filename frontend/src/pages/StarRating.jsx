export default function StarRating({
                                       rating = 0,
                                   }) {
    return (
        <div>
            {[1,2,3,4,5].map((star) => (
                <span
                    key={star}
                    style={{
                        color:
                            star <= rating
                                ? "gold"
                                : "gray",
                        fontSize: "24px",
                    }}
                >
          ★
        </span>
            ))}
        </div>
    );
}