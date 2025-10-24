import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: function () {
                // Only require password for local users
                return !this.googleId;
            },
        },
        displayName: {
            type: String,
            required: function () {
                // If no Google account, must have displayName
                return !this.googleId;
            },
            trim: true,
            maxlength: 200,
        },
        bio: {
            type: String,
            maxlength: 500
        },
        phone: {
            type: String,
            sparse: true,
            trim: true,
            match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
        },
        avatar: {
            url: String, // link CDN de hien thi hinh
            publicId: String //--cloudinary de xoa hinh
        },
        coverPhoto: {
            url: String,
            publicId: String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        lastSeen: Date,
        role: {
            type: String,
            enum: ["admin", "user"]
        }
    },
    { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ phone: 1 }, { sparse: true });


userSchema.pre("save", async function (next) {
    if (!this.username || this.username.trim().length === 0) {
        let base = "";

        if (this.displayName) {
            // chuyển sang lowercase và bỏ ký tự không phải chữ/số
            base = this.displayName
                .normalize("NFD") // tách dấu tiếng Việt
                .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
                .replace(/[^a-zA-Z0-9]/g, "") // chỉ giữ chữ & số
                .toLowerCase();
        } else if (this.email) {
            base = this.email
                .split("@")[0]
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();
        } else {
            base = "user";
        }

        // cắt ngắn nếu quá dài
        base = base.slice(0, 20);

        let usernameCandidate = base;
        let counter = 0;

        while (await mongoose.models.User.findOne({ username: usernameCandidate })) {
            counter++;
            usernameCandidate = `${base}${Math.floor(Math.random() * 10000)}`;
            if (counter > 5) break;
        }

        this.username = usernameCandidate;
    }

    next();
});

const User = mongoose.model("User", userSchema);

export default User;
