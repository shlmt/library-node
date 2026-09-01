import { Member } from "./member.model.js";

export const memberRepository = {
  findAll() {
    return Member.find().sort({ createdAt: -1 });
  },

  findById(id) {
    return Member.findById(id);
  },

  create(data) {
    return Member.create(data);
  },

  update(id, data) {
    return Member.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  delete(id) {
    return Member.findByIdAndDelete(id);
  },
};
