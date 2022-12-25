git checkout release
npm run build
rm -r docs
mv dist docs
git add docs
git commit --amend
git push --force