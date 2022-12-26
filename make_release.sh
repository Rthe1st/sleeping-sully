git checkout release
git rebase main
npm run build
rm -r docs
mv dist docs
echo "sleepingsully.com" > docs/CNAME
git add docs
git commit --amend
git push --force
git checkout main
