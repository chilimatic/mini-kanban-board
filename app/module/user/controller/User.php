<?php
namespace minikanban\app\module\user\controller;
use chilimatic\lib\di\ClosureFactory;
use chilimatic\lib\http\response\Content;
use chilimatic\lib\http\response\Response;
use chilimatic\lib\tool\Tool;
use minikanban\app\module\main\controller\Application;

/**
 *
 * @author j
 * Date: 11/4/15
 * Time: 7:38 PM
 *
 * File: Authentification.php
 */

class User extends Application
{

    public function loginAction()
    {

        $response = new Response();
        $content = new Content();

        $map = [
            'status' => [
                'loggedin' => false
            ],
            'data' => [
                'user' => null
            ]
        ];

        /**
         * @var \minikanban\app\module\user\service\authentication $authenticationService
         */
        $authenticationService = ClosureFactory::getInstance()->get('authentication-service', [], true);
        /**
         * @var \chilimatic\lib\request\handler $request
         */
        $request = ClosureFactory::getInstance()->get('request-handler', []);

        if ($request->getPost()->get('username') && $request->getPost()->get('password')) {
            $user = $authenticationService->getUserByUsernameAndPassword(
                $request->getPost()->get('username'),
                $request->getPost()->get('password')
            );

            if ($user) {
                $this->session->user = $user;
                $map['status']['loggedIn'] = true;
                $map['data']['user'] = $user;
            }
        }

        $content->setData($map);
        $response->setContent($content);
        $this->getView()->response = $response;
    }

    public function registerAction()
    {
        $response = new Response();
        $content = new Content();

        $map = [
            'status' => [
                'created' => false
            ]
        ];


        /**
         * @var \chilimatic\lib\request\handler $request
         */
        $request = ClosureFactory::getInstance()->get('request-handler', []);

        $dm = ClosureFactory::getInstance()->get('document-manager', []);
        $user = $dm->findOneBy('\minikanban\app\module\user\model\User', ['username' => $request->getPost()->get('username')]);

        if (!$user) {
            $seed = ClosureFactory::getInstance()->get('config')->get('password_seed');

            $user = new \minikanban\app\module\user\model\User();
            $user->setId(uniqid());
            $user->setUsername($request->getPost()->get('username'));
            $salt = Tool::generateSalt($seed);
            $user->setSalt($salt);
            $user->setPassword(
                Tool::userPasswordGenerator(
                    $request->getPost()->get('password'),
                    $salt,
                    PASSWORD_BCRYPT,
                    ['cost' => 8]
                )
            );

            $user->setEmail($request->getPost()->get('email'));
            if ($dm->persist($user)) {
                $map['status']['created'] = true;
                $content->msg = _('success');
            } else {
                $content->msg = _('Error during creation');
            }
        } else {
            $content->msg = _('User already exists');
        }

        $content->setData([
            $map
        ]);
        $this->getView()->response = $response->setContent($content);
    }
}